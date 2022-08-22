using FluentAssertions.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StationaryServer2.Interface;
using StationaryServer2.Models;
using StationaryServer2.Models.Stationary;
using StationaryServer2.Repository;
using StationaryServer2.service;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StationaryServer2
{
    public class Startup
    {
        readonly string AllowSpecificOrigins = "AllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {          
            services.AddCors();
            services.AddControllers();

            #region Work with Database
            services.AddDbContext<StationeryContext>(options => options.UseSqlServer(Configuration.GetConnectionString("StationeryCon")));
            #endregion

            #region Register Service
            services.AddScoped(typeof(IStationeryRepository<>), typeof(StationeryRepository<>));
            services.AddScoped<IRepositoryAll, RepositoryAll>();
            services.AddScoped<IJwtService, JwtService>();
            #endregion

            #region Allow CORS
            services.AddCors(options =>
            {
                options.AddPolicy(name: AllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder.AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(origin=>true)
            .AllowCredentials();
                                  });
            });
            #endregion

            #region Add Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "StationaryServer2", Version = "v1" });
                c.EnableAnnotations();
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                                                                           {
                                                                             new OpenApiSecurityScheme
                                                                             {
                                                                               Reference = new OpenApiReference
                                                                               {
                                                                                 Type = ReferenceType.SecurityScheme,
                                                                                 Id = "Bearer"
                                                                               }
                                                                              },
                                                                              new string[] { }
                                                                            }
                                                                          });

            });

            #endregion

            #region JWT Authentication
            services.Configure<JwtConfig>(Configuration.GetSection("JwtConfig"));//ket noi,
            var key = Encoding.ASCII.GetBytes(Configuration["JwtConfig:Secret"]);//ma hoa va sinh ra JWT, ma hoa ve byte

            var tokenValidationParams = new TokenValidationParameters
            {
                //tu cap token
                ValidateIssuer = false,
                ValidateAudience = false,//sai dich vu o ngoai thi true va chi duong dan cua dich vu

                //ky len token cua minh
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),     
                
                //thoi gian hieu luc
                ValidateLifetime = true,
                RequireExpirationTime = true,
                ClockSkew = TimeSpan.Zero
            };
            services.AddSingleton(tokenValidationParams);
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;//them thu vien
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;//them thu vien

            })
            .AddJwtBearer(jwt =>
            {
                jwt.SaveToken = true;
                jwt.TokenValidationParameters = tokenValidationParams;
            });
            #endregion

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "StationaryServer2 v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(AllowSpecificOrigins);
            //khai bao tren them vao ow duoi
            app.UseAuthentication();
            app.UseAuthorization();
            if (!Directory.Exists(Path.Combine(env.ContentRootPath, "Images")))
            {
                Directory.CreateDirectory(Path.Combine(env.ContentRootPath, "Images"));
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "Images")),
                RequestPath = "/Images"
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
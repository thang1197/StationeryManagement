using StationaryServer2.DTO.JWT;
using StationaryServer2.DTO.User.Request;
using StationaryServer2.DTO.User.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StationaryServer2.Interface;
using StationaryServer2.Models.Stationary;
using StationaryServer2.Repository;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;

namespace StationaryServer2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
            Byte[] originalBytes;
            Byte[] encodedBytes;
            public MD5 md5;
            private readonly IJwtService _JwtService;
            private readonly IStationeryRepository<Employee> _employeeManager;
            private readonly IStationeryRepository<Role> _roleManager;
            public LoginController(IJwtService jwtService, IStationeryRepository<Employee> employeeManager, IStationeryRepository<Role> roleManager)
            {
                this._JwtService = jwtService;
                this._employeeManager = employeeManager;
                this._roleManager = roleManager;
            }

            

            [HttpPost]
            [Route("Login")]
            [SwaggerOperation(
                        Summary = "Login to System",
                        Description = "Login to System",
                        OperationId = "UserController.Login",
                        Tags = new[] { "UserController" })]
            public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
            {
                if (ModelState.IsValid)
                {
                    var existingUser = await _employeeManager.GetById(request.EmployeeID);


                    if (existingUser == null)
                    {
                        return BadRequest(new LoginResponse());
                    }
                    var isCorrect = false;
                    if (existingUser.Password.Equals(EncodePassword(request.Password)) == true)
                    {
                        isCorrect = true;
                    }


                    if (isCorrect == false)
                    {
                        return BadRequest();
                    }

                    var jwtToken = await _JwtService.GenerateJwtToken(existingUser);

                    return Ok(jwtToken);
                }

                return BadRequest(new LoginResponse());
            }

            [HttpPost]
            [Route("RefreshToken")]
            [SwaggerOperation(
             Summary = "Get new Access Token",
             Description = "Get new Access Token",
             OperationId = "Auth.RefreshToken",
             Tags = new[] { "AuthEndpoints" })
         ]
            public async Task<ActionResult<dynamic>> RefreshToken(RenewToken request)
            {
                if (ModelState.IsValid)
                {
                    var result = await _JwtService.VerifyAndGenerateToken(request.Token, request.RefreshToken);

                    if (result == null)
                    {
                        return BadRequest(new
                        {
                            Errors = new List<string>() {
                            "Invalid tokens"
                        },
                            Success = false
                        });
                    }

                    return Ok(result);
                }

                return BadRequest(new
                {
                    Errors = new List<string>() {
                    "Invalid payload"
                },
                    Success = false
                });
            }

            string EncodePassword(string password)
            {
                md5 = new MD5CryptoServiceProvider();
                originalBytes = ASCIIEncoding.Default.GetBytes(password);
                encodedBytes = md5.ComputeHash(originalBytes);
                return BitConverter.ToString(encodedBytes);
            }
    }
    }


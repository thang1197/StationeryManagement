using StationaryServer2.DTO.User.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StationaryServer2.Interface;
using StationaryServer2.Models;
using StationaryServer2.Models.Stationary;
using StationaryServer2.Repository;
using StationaryServer2.Specification;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace StationaryServer2.service
{

    public class JwtService : IJwtService
    {
        //doc ket noi
        private readonly JwtConfig _jwtConfig;
        private readonly IStationeryRepository<RefreshToken> _refreshTokenRepository;
        private readonly IStationeryRepository<Employee> _employeeRepository;
        public JwtService(
               StationeryContext context,
               IStationeryRepository<RefreshToken> refreshTokenRepository,
               IStationeryRepository<Employee> employeeRepository,
               TokenValidationParameters tokenValidationParams,
               IOptionsMonitor<JwtConfig> optionsMonitor)
        {
            this._refreshTokenRepository = refreshTokenRepository;
            //ket noi tu dong
            this._jwtConfig = optionsMonitor.CurrentValue;
            this._employeeRepository = employeeRepository;
        }

        //cap jwt
        public async Task<LoginResponse> GenerateJwtToken(Employee employee)
        {
            var utcNow = DateTime.UtcNow;
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id", employee.EmployeeId),
                    new Claim(JwtRegisteredClaimNames.Email, employee.Email),
                    new Claim(JwtRegisteredClaimNames.Sub, employee.EmployeeName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                }),
                Expires = utcNow.AddHours(_jwtConfig.ExpiredInHours), // 5-10 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),

            };

            //user.UserRoles.ToList().ForEach(u => { tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, u.Role.Name)); });

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = jwtTokenHandler.WriteToken(token);

            var refreshToken = new RefreshToken()
            {
                JwtId = token.Id,
                IsUsed = false,
                IsRevorked = false,
                EmployeeId = employee.EmployeeId,
                AddedDate = utcNow,
                ExpiryDate = utcNow.AddHours(_jwtConfig.ExpiredInHours+1),
                Token = RandomString(35) + Guid.NewGuid()
            };

            await _refreshTokenRepository.Insert(refreshToken);

            // lay role cua employee, gan user Role ben duoi
            //var roles = await _userManager.GetRolesAsync(user); new List<string>()
            return new LoginResponse
            {
                EmployeeName = employee.EmployeeName,
                EmployeeID = employee.EmployeeId,
                Token = jwtToken,
                RefreshToken = refreshToken.Token,
                UserRoles = employee.RoleId,
                IsAdmin = employee.IsAdmin,
            };
        }

        public async Task<dynamic> VerifyAndGenerateToken(string token, string refreshToken)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();


            try
            {
                // Validation 1 - Validation JWT token format
                // var tokenInVerification = jwtTokenHandler.ValidateToken(token, _tokenValidationParams, out var validatedToken);
                var validatedToken = jwtTokenHandler.ReadJwtToken(token);

                // Validation 2 - Validate encryption alg
                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                {
                    var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);

                    if (result == false)
                    {
                        return null;
                    }
                }

                // Validation 3 - validate expiry date
                var utcExpiryDate = long.Parse(validatedToken.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);

                var expiryDate = UnixTimeStampToDateTime(utcExpiryDate);

                if (expiryDate > DateTime.UtcNow)
                {
                    return new
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token has not yet expired"
                        }
                    };
                }

                // validation 4 - validate existence of the token
                var tokenSpec = new RefreshTokenSpec(refreshToken);
                var storedToken = await _refreshTokenRepository.GetAsyncSpec(tokenSpec);
                if (storedToken.ExpiryDate < DateTime.UtcNow)
                {
                    storedToken.IsRevorked = true;

                    await _refreshTokenRepository.Update(storedToken);

                    return new
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Refresh Token has expired"
                        }
                    };
                }

                if (storedToken == null)
                {
                    return new
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token does not exist"
                        }
                    };
                }

                // Validation 5 - validate if used
                if (storedToken.IsUsed)
                {
                    return new
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token has been used"
                        }
                    };
                }

                // Validation 6 - validate if revoked
                if (storedToken.IsRevorked)
                {
                    return new
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token has been revoked"
                        }
                    };
                }
                // Validation 7 - validate the id
                var jti = validatedToken.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

                if (storedToken.JwtId != jti)
                {
                    return new
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token doesn't match"
                        }
                    };
                }

                // update current token 

                storedToken.IsUsed = true;

                await _refreshTokenRepository.Update(storedToken);

                // Generate a new token
                var dbUser = await _employeeRepository.GetById(storedToken.EmployeeId);
                return await GenerateJwtToken(dbUser);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Lifetime validation failed. The token is expired."))
                {

                    return new
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token has expired please re-login"
                        }
                    };

                }
                else
                {
                    return new
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Something went wrong."
                        }
                    };
                }
            }
        }

        private static string RandomString(int length)
        {
            var random = new Random();
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(x => x[random.Next(x.Length)]).ToArray());
        }
        private static DateTime UnixTimeStampToDateTime(long unixTimeStamp)
        {
            var dateTimeVal = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTimeVal = dateTimeVal.AddSeconds(unixTimeStamp).ToUniversalTime();

            return dateTimeVal;
        }
    }

}

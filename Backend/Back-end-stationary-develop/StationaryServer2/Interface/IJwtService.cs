
using StationaryServer2.DTO.User.Response;
using StationaryServer2.Models.Stationary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.Interface
{
    public interface IJwtService
    {
        Task<LoginResponse> GenerateJwtToken(Employee employee);
        Task<dynamic> VerifyAndGenerateToken(string token, string refreshToken);
    }
}

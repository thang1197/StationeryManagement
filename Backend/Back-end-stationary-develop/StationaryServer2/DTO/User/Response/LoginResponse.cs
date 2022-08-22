using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.DTO.User.Response
{
    public class LoginResponse
    {
        public string EmployeeName { get; set; }
        public string EmployeeID { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public int UserRoles { get; set; }
        public bool? IsAdmin { get; set; }
    }
}

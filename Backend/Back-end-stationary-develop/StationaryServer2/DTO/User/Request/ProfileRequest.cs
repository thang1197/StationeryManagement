using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.DTO.User.Request
{
    public class ProfileRequest
    {
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Gender { get; set; }
        public DateTime Birthday { get; set; }
        public string Password { get; set; }
        public string Department { get; set; }
        public string Superiors { get; set; }
        public int RoleId { get; set; }
        public bool? IsAdmin { get; set; }
        public int? Budget { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string OldPass { get; set; }
    }
}

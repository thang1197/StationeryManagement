using System;
using System.Collections.Generic;

#nullable disable

namespace StationaryServer2.Models.Stationary
{
    public partial class Employee
    {
        public Employee()
        {
            Orders = new HashSet<Order>();
            RefreshTokens = new HashSet<RefreshToken>();
        }

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

        public virtual Role Role { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
    }
}

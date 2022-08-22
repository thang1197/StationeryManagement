using System;
using System.Collections.Generic;

#nullable disable

namespace StationaryServer2.Models.Stationary
{
    public partial class Role
    {
        public Role()
        {
            Employees = new HashSet<Employee>();
            Products = new HashSet<Product>();
        }

        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int? Budget { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Employee> Employees { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}

using System;
using System.Collections.Generic;

#nullable disable

namespace StationaryServer2.Models.Stationary
{
    public partial class Order
    {
        public Order()
        {
            OrderItems = new HashSet<OrderItem>();
        }

        public int OrderId { get; set; }
        public string EmployeeId { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual Employee Employee { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}

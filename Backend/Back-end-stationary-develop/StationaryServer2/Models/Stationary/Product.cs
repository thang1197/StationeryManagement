using System;
using System.Collections.Generic;

#nullable disable

namespace StationaryServer2.Models.Stationary
{
    public partial class Product
    {
        public Product()
        {
            OrderItems = new HashSet<OrderItem>();
        }

        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int? Quantity { get; set; }
        public int Price { get; set; }
        public string FeatureImgPath { get; set; }
        public int? CategoryId { get; set; }
        public bool? ProductEnable { get; set; }
        public int RoleId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public virtual Category Category { get; set; }
        public virtual Role Role { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}

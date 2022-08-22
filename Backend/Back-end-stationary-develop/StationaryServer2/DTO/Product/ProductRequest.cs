using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.DTO.Product
{
    public class ProductRequest
    {
        public string ProductName { get; set; }
        public int? Quantity { get; set; }
        public int Price { get; set; }
        public int? CategoryId { get; set; }
        public bool? ProductEnable { get; set; }
        public int RoleId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}

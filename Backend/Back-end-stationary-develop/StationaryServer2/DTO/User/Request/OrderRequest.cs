using StationaryServer2.Models.Stationary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.DTO.User.Request
{
    public class OrderRequest
    {
        public string EmployeeId { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<OrderItemRequest> Products { get; set; }
    }
}

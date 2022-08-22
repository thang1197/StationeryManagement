using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.DTO.User.Request
{
    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}

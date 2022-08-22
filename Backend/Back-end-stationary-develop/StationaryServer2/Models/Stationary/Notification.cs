using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.Models.Stationary
{
    public class Notification
    {
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string ReceiveId { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}

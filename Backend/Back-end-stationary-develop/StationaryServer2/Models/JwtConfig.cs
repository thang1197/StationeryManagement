using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.Models
{
    public class JwtConfig
    {
        public string Secret { get; set; }
        public int ExpiredInHours { get; set; }
    }
}

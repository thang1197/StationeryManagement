﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.DTO.JWT
{
    public class RenewToken
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}

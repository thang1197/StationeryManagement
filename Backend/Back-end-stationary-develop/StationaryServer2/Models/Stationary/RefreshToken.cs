using System;
using System.Collections.Generic;

#nullable disable

namespace StationaryServer2.Models.Stationary
{
    public partial class RefreshToken
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; }
        public string Token { get; set; }
        public string JwtId { get; set; }
        public bool IsUsed { get; set; }
        public bool IsRevorked { get; set; }
        public DateTime? AddedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public virtual Employee Employee { get; set; }
    }
}

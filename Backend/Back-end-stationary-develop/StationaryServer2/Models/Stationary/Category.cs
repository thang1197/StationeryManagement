using System;
using System.Collections.Generic;

#nullable disable

namespace StationaryServer2.Models.Stationary
{
    public partial class Category
    {
        public Category()
        {
            Products = new HashSet<Product>();
        }

        public int CategotyId { get; set; }
        public string CategotyName { get; set; }
        public int? IdParent { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}

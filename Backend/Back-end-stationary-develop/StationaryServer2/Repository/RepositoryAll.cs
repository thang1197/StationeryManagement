using StationaryServer2.Models.Stationary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.Repository
{
    public class RepositoryAll : IRepositoryAll
    {
        public readonly StationeryContext _db;
        public RepositoryAll(StationeryContext db)
        {
            _db = db;
        }
        
    }
}

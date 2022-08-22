using Ardalis.Specification;
using StationaryServer2.Models.Stationary;

namespace StationaryServer2.Specification
{
    
    public class RefreshTokenSpec : Specification<RefreshToken>, ISingleResultSpecification
    {
        public RefreshTokenSpec(string token)
        {
            Query.Where(item => item.Token == token);
        }
    }
}

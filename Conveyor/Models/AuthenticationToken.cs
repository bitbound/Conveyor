using Conveyor.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Models
{
    public class AuthenticationToken
    {
        public DateTime DateCreated { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        [Key]
        public int Id { get; set; }

        public DateTime? LastUsed { get; set; }
        public string LastUsedIp { get; set; }
        public string Token { get; set; }
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }

        public AuthTokenDTO ToDto()
        {
            return new AuthTokenDTO()
            {
                DateCreated = new DateTime(DateCreated.Ticks, DateTimeKind.Utc).ToString("o"),
                Description = Description,
                Token = Token,
                Id = Id,
                LastUsed = LastUsed.HasValue ? new DateTime(LastUsed.Value.Ticks, DateTimeKind.Utc).ToString("o") : null,
                LastUsedIp = LastUsedIp
            };
        }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Models
{
    public class AuthenticationToken
    {
        [Key]
        public int Id { get; set; }
        public ApplicationUser User { get; set; }
        public string Key { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUsed { get; set; }
        public string LastUsedIp { get; set; }
    }
}

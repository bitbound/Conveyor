using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<AuthenticationToken> AuthenticationTokens { get; set; }
        public List<FileDescription> FileDescriptions { get; set; }
    }
}

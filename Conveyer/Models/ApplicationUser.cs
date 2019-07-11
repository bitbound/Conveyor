using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyer.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DbSet<AuthenticationToken> AuthenticationTokens { get; set; }
        public DbSet<FileDescription> FileDescriptions { get; set; }
    }
}

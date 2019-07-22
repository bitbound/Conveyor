using Conveyor.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
           
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<FileDescription>()
                .HasIndex(x => x.Guid);

            builder.Entity<AuthenticationToken>()
                .HasIndex(x => x.Token);

            builder.Entity<FileDescription>()
                .HasOne(x => x.Content)
                .WithOne(x => x.FileDescription)
                .HasForeignKey<FileContent>(x => x.FileDescriptionId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<AuthenticationToken> AuthenticationTokens { get; set; }
        public DbSet<FileContent> FileContents { get; set; }
        public DbSet<FileDescription> FileDescriptions { get; set; }
        public DbSet<EventLog> EventLogs { get; set; }
    }
}

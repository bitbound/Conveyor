using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Services
{
    public class ApplicationConfig
    {
        public ApplicationConfig(IConfiguration config)
        {
            Config = config;
        }
        public bool AllowSelfRegistration => bool.Parse(Config["ApplicationOptions:AllowSelfRegistration"]);
        public double DataRetentionInDays => double.Parse(Config["ApplicationOptions:DataRetentionInDays"]);
        public string DbProvider => Config["ApplicationOptions:DbProvider"];
        private IConfiguration Config { get; set; }
    }
}

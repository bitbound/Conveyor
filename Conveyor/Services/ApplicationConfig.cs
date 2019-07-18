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
        public double DataRetentionInDays => double.Parse(Config["ApplicationOptions:DataRetentionInDays"]);
        private IConfiguration Config { get; set; }
    }
}

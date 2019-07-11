using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyer.Models
{
    public class FileContent
    {
        public byte[] Content { get; set; }
        
        [Key]
        public int Id { get; set; }
    }
}

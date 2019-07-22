using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Models
{
    public class FileContent
    {
        public byte[] Content { get; set; }

        public FileDescription FileDescription { get; set; }

        public int FileDescriptionId { get; set; }

        [Key]
        public int Id { get; set; }
    }
}

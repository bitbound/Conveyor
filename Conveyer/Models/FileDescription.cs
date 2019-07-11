using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyer.Models
{
    public class FileDescription
    {
        public FileContent Content { get; set; }

        public string ContentDisposition { get; internal set; }
        public string ContentType { get; set; }
        public DateTime DateUploaded { get; set; }

        public string FileName { get; set; }

        [Key]
        public int Id { get; set; }
        public long Size { get; set; }
        public ApplicationUser User { get; set; }
    }
}

using Conveyor.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Models
{
    public class FileDescription
    {
        public FileContent Content { get; set; }
        public string ContentDisposition { get; set; }
        public string ContentType { get; set; }
        public DateTime DateUploaded { get; set; }
        [StringLength(260)]
        public string FileName { get; set; }

        public string Guid { get; set; }

        [Key]
        public int Id { get; set; }
        public long Size { get; set; }
        public ApplicationUser User { get; set; }

        public string UserId { get; set; }

        public FileDescriptionDTO ToDto()
        {
            return new FileDescriptionDTO()
            {
                ContentDisposition = ContentDisposition,
                ContentType = ContentType,
                DateUploaded = DateUploaded,
                FileName = FileName,
                Guid = Guid,
                Id = Id,
                SizeInKb = Math.Round(Size / (decimal)1024, 2)
            };
        }
    }
}

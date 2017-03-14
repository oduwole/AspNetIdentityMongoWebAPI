using AspNetIdentityMongoWebAPI.API.Context;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API.Models
{
    public class Datasets
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int AppID { get; set; }
        [StringLength(128, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        public string Name { get; set; }
        [Required]
        public string  FileUrl { get; set; }
        [StringLength(128, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 3)]
        public string Category { get; set; }
        public string Description { get; set; }
        [Required]
        public DateTime  UploadedDate { get; set; }
        [Required ]
        public bool isDeleted { get; set; }
        [Required ]
        public bool IsDataOpen { get; set; }
        [Required]
        public bool isPromoOn { get; set; }
        [Required]
        public Double  Price { get; set; }
        public Double  PromoPrice { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid  TransactionID { get; set; }
        public string Id { get; set; }
        [JsonIgnore]
        public virtual ApplicationUser ApplicationUser { get; set; }
        [Required ]
        public string  Organization { get; set; }
        [Required]
        public bool ApprovalStatus { get; set; }

    }

    public class DatasetsMap : EntityTypeConfiguration<Datasets>
    {
        public DatasetsMap()
        {
            // Primary Key
            HasKey(t => t.TransactionID );
        }
    }
}

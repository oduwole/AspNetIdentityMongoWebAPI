using AspNetIdentityMongoWebAPI.API.Context;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API.Models
{
    public class Transactions
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int AppID { get; set; }
        public string Id { get; set; }
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid TransactionID { get; set; }
        public bool reverseStatus { get; set; }
        public string clientID { get; set; }
        public string merchantID { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TransactionIP { get; set; }
        public Double productPrice { get; set; }
        public Guid ProductID { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

    }
}

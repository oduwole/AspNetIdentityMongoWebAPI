using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API.Entities
{
    public class FileResponseMessage : FileMessage
    {
        #region Public Properties

        public bool IsExists { get; set; }

        #endregion
    }

    public class FileMessage
    {
        #region Public Properties

        public string Content { get; set; }

        #endregion

    }
}

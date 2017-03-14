﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API.Entities
{
    public class FileMetaData
    {
        #region Private Members

        private FileResponseMessage _fileResponseMessage = new FileResponseMessage();

        #endregion

        #region Public Properties

        public FileResponseMessage FileResponseMessage
        {
            get { return _fileResponseMessage ?? new FileResponseMessage(); }
            set { _fileResponseMessage = value; }
        }

        public string FileName { get; set; }

        public string FileExtension { get; set; }

        public long FileSize { get; set; }

        public string FilePath { get; set; }

        #endregion

        #region Constructor

        public FileMetaData()
        {
        }

        #endregion

    }
}

using AlcoStack.Interface;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace AlcoStack.Service;

 public class FileService(IWebHostEnvironment env) : IFileService
 {
     public Tuple<int, string> SaveImage(IFormFile imageFile)
        {
            try
            {
                var contentPath = env.ContentRootPath;
                var path = Path.Combine(contentPath, "wwwroot/images");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                // Check the allowed extenstions
                var ext = Path.GetExtension(imageFile.FileName);
                var allowedExtensions = new string[] { ".jpg", ".png", ".jpeg" };
                if (!allowedExtensions.Contains(ext))
                {
                    string msg = $"Only {string.Join(",", allowedExtensions)} extensions are allowed";
                    return new Tuple<int, string>(0, msg);
                }
                string uniqueString = Guid.NewGuid().ToString();
                // we are trying to create a unique filename here
                var newFileName = uniqueString + ext;
                var fileWithPath = Path.Combine(path, newFileName);
                var stream = new FileStream(fileWithPath, FileMode.Create);
                imageFile.CopyTo(stream);
                stream.Close();
                return new Tuple<int, string>(1, newFileName);
            }
            catch (Exception ex)
            {
                return new Tuple<int, string>(0, "Error has occured");
            }
        }
     
        public async Task DeleteImage(string imageFileName)
        {
            var contentPath = env.ContentRootPath;
            var path = Path.Combine(contentPath, $"wwwroot/images", imageFileName);
            if (File.Exists(path))
                File.Delete(path);
        }

    }
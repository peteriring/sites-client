
require 'zlib'
require 'stringio'
require 'htmlcompressor'
require 'image_optim'

folder_path = "dist"
types = ["*.js","*.css","*.html"]


html = File.join(".", "#{folder_path}/**", "*.html")
Dir.glob(html) do |htmlfile|
	file = File.read("#{htmlfile}")
	compressor = HtmlCompressor::Compressor.new
    compress = compressor.compress("#{file}")
    File.write("#{htmlfile}","#{compress}")
end

types.each do |type|

files = File.join(".", "#{folder_path}/", "**", "#{type}")

	Dir.glob(files) do |file|
		Zlib::GzipWriter.open("#{file}.gz", level = Zlib::BEST_COMPRESSION) do |gz|
				gz.orig_name = "#{file}"
				gz.write IO.binread("#{file}")
				gz.close
		end
	end

gz = File.join(".", "#{folder_path}", "**", "*.gz")

	Dir.glob(gz) do |gzfile|
		filename = File.basename(gzfile, File.extname(gzfile))
		path = File.dirname(gzfile)
		File.rename(gzfile, "#{path}/#{filename}")
	end


end






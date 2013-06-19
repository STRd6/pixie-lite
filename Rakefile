task :default => [:build]

task :build do
  src_files = Dir["source/*.coffee"]
  sh "coffee", "-bcj", "public/main.js", *src_files

  styl_files = Dir["source/*.styl"]
  sh "stylus < #{styl_files.join(' ')} > public/main.css"
end

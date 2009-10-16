require 'fileutils'

puts IO.read(File.join(File.dirname(__FILE__), 'README' ))
#Copy the Javascript files
puts "Copying Javascripts..."
FileUtils.copy(Dir[File.dirname(__FILE__) + '/javascript/*.js'], File.dirname(__FILE__) + '/../../../public/javascripts/')
puts "...Done"

#Copy the controller file
puts "Copying controller..."
FileUtils.copy(Dir[File.dirname(__FILE__) + '/controller/*.rb'], File.dirname(__FILE__) + '/../../../app/controllers/')
puts "...Done"

#Copy the view file
puts "Copying view..."
dir = File.dirname(__FILE__) + '/../../../app/views/js_runit/'
Dir.mkdir(dir)
FileUtils.copy(Dir[File.dirname(__FILE__) + '/view/js_runit/*.erb'], dir)
puts "...Done"


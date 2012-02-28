module DatajamChat::InstallJob

  def self.perform
    # Copy files to GridFS
    fs = Mongo::GridFileSystem.new(Mongoid.database)
    Dir.glob("#{DatajamChat::Engine.root}/public/**/*.*") do |filepath|
      filename = filepath.gsub("#{DatajamChat::Engine.root}/public/", '')
      fs.open(filename, 'w', :delete_old => true) do |f|
        f.write(File.open(filepath))
      end
    end
    # install settings
    DatajamChat::Engine.load_seed
  end
end
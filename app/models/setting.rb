class Setting
  # callbacks to be run after save
  def chat_bitly_username_callback
    query_opts = Datajam::Chat.bitly.instance_variable_get('@default_query_opts')
    query_opts.update(:login => value)
    Datajam::Chat.bitly.instance_variable_set('@default_query_opts', query_opts)
  end

  def chat_bitly_api_key_callback
    query_opts = Datajam::Chat.bitly.instance_variable_get('@default_query_opts')
    query_opts.update(:apiKey => value)
    Datajam::Chat.bitly.instance_variable_set('@default_query_opts', query_opts)
  end

end

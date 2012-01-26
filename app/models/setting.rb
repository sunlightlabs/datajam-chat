class Setting

  def datajam_chat_update_bitly_login
    query_opts = DatajamChat.bitly.instance_variable_get('@default_query_opts')
    query_opts.update(:login => value)
    DatajamChat.bitly.instance_variable_set('@default_query_opts', query_opts)
  end

  def datajam_chat_update_bitly_apikey
    query_opts = DatajamChat.bitly.instance_variable_get('@default_query_opts')
    query_opts.update(:apiKey => value)
    DatajamChat.bitly.instance_variable_set('@default_query_opts', query_opts)
  end

end

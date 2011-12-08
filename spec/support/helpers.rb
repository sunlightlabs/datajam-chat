module MessageExampleHelperMethods
  def incoming_message
    {:text => 'hello, world!', :display_name => 'foo', :is_public => false, :is_moderated => false}
  end

  def approved_message
    {:text => 'hello, world!', :display_name => 'foo', :is_public => true, :is_moderated => true}
  end

  def rejected_message
    {:text => 'hello, world!', :display_name => 'foo', :is_public => false, :is_moderated => true}
  end
end
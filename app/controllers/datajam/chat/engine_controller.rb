module Datajam
  module Chat
    class EngineController < ::ApplicationController

      protected

      def locals
        context = {}
        variable_names = instance_variable_names.reject { |name| name.match(/@_/) }
        variable_names.collect do |name|
          context[name.sub('@', '').to_sym] = instance_variable_get(name)
        end

        context
      end
    end
  end
end

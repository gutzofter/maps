require 'test_helper'

class ChapThreeControllerTest < ActionController::TestCase
  test "list markers" do
    er = "{\"success\":true,\"content\":[{\"marker\":{\"found\":\"found\",\"id\":2053932785,\"lat\":1.0,\"left\":\"left\",\"lng\":-1.0}}]}"
    get :list
    assert_response :success
    puts (instance_var :res).to_json
    assert_equal er, (instance_var :res).to_json
  end

  test "responder" do
    get :responder
    assert_response :success
    puts (instance_var :res).to_json
    assert_equal "{\"success\":true,\"content\":\"<div><strong>RESPONDED</strong></div>\"}", (instance_var :res).to_json
  end

  protected
    def instance_var(name)
      @response.template.assigns[name.to_s]
    end
end

require 'test_helper'

class ChapSixControllerTest < ActionController::TestCase
  test "towers" do
    get :map6
    assert_response :success
    assert_equal 1, (instance_var :towers).size
  end

  protected
    def instance_var(name)
      @response.template.assigns[name.to_s]
    end
end

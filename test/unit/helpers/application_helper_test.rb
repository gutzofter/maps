require 'test_helper'

class ApplicationHelperTest < ActionView::TestCase

  test "link_href_with_id" do
    assert_equal "<a href=\"href.html\" id=\"id\">link</a>",
      link_href_with_id('link', {:href => "href.html", :id => 'id'})
  end

end

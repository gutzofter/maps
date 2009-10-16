# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def link_href_with_id(name, *args)
    html_options = args.extract_options!.symbolize_keys

    href = html_options[:href] || '#'
    id = html_options[:id] || ''

    content_tag(:a, name, html_options.merge(:href => href, :id => id))
  end
end

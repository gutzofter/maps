class ChapThreeController < ApplicationController
  def map3
    
  end
  
  def create
    marker = Marker.new(params[:m])
    if marker.save
      res = {:success => true, :content => "<div><strong>found</strong>#{marker.found}</div><div><strong>left</strong>#{marker.left}</div>"}
    else
      res = {:success => false, :content => "Could not save the marker"}
    end
    render :text => res.to_json
  end
  
  def list
    all_markers = Marker.find :all
    @res = {:success => true, :content => all_markers }
    render :text => @res.to_json
  end
  
  def responder
    @res = { :success => true, :content => "<div><strong>RESPONDED</strong></div>" }
    render :text => @res.to_json
  end
end

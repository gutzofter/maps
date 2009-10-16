class ChapSevenController < ApplicationController
  def cities_within_bounds
    ne = params[:ne].split(',').collect{|e|e.to_f}
    sw = params[:sw].split(',').collect{|e|e.to_f}
    # if the NE longitude is less than the SW longitude, 
    # it means we are split over the meridian.
    
    if ne[1] > sw[1] 
      conditions = 'lng > ? AND lng < ? AND lat <= ? AND lat >= ?'
    else
      conditions = '(lng >= ? OR lng < ?) AND lat <= ? AND lat >= ?' 
    end
    cities = CapitalCity.find :all, :conditions => [conditions,sw[1],ne[1],ne[0],sw[0]]
    
    render :text=>cities.collect{|c|c.attributes}.to_json
  end

end

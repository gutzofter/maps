class ChapSixController < ApplicationController
  def map6
    @towers = Tower.find :all,
      :conditions=>['state = ? AND latitude < ? AND longitude > ?  AND latitude > ? AND longitude < ?',
        'HI', 20.40, -156.34, 18.52, -154.67]
    
    @types = @towers.collect{|tower|tower.structure_type}.uniq
  end

  def list
    @towers = Tower.find :all,
      :conditions=>['state = ? AND latitude < ? AND longitude > ?  AND latitude > ? AND longitude < ?',
        'HI', 20.40, -156.34, 18.52, -154.67]
  end

  def esri
    
  end
  def pos

  end

  def thrashbox
    
  end
end

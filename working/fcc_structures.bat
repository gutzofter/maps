mysqlimport --delete --fields-terminated-by="|" --columns=unique_si,address,city,state,height,elevation,ohag,ohamsl,structure_type --user=root --password --local maps_development fcc_structures.dat
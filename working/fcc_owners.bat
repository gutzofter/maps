mysqlimport --delete --fields-terminated-by="|" --columns=unique_si,name,address,city,state,zip --user=root --password --local maps_development fcc_owners.dat
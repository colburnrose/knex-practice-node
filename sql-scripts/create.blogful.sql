create table blogful_articles(
id integer primary key generated by default as identity,
title text not null,
date_published TimeStamp default now() not null,
content text
)
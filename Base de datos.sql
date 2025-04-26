
create database floricola;
use floricola;
/*==============================================================*/
/* DBMS name:      Sybase SQL Anywhere 12                       */
/* Created on:     9/8/2024 21:38:24                            */
/*==============================================================*/

/*==============================================================*/
/* Table: INCLUYE                                               */
/*==============================================================*/
create table INCLUYE 
(
   ID_PRODUCTO          integer                        not null,
   ID_PEDIDO            integer                        not null,
   CANTIDAD             integer                        null,
   ID_PRODUCTO_PEDIDO   char(10)                       not null,
   constraint PK_INCLUYE primary key (ID_PRODUCTO_PEDIDO)
);

/*==============================================================*/
/* Index: INCLUYE_PK                                            */
/*==============================================================*/
create unique index INCLUYE_PK on INCLUYE (
ID_PRODUCTO_PEDIDO ASC
);

/*==============================================================*/
/* Index: INCLUYE2_FK                                           */
/*==============================================================*/
create index INCLUYE2_FK on INCLUYE (
ID_PEDIDO ASC
);

/*==============================================================*/
/* Index: INCLUYE_FK                                            */
/*==============================================================*/
create index INCLUYE_FK on INCLUYE (
ID_PRODUCTO ASC
);

/*==============================================================*/
/* Table: PEDIDO                                                */
/*==============================================================*/
create table PEDIDO 
(
   ID_PEDIDO            integer                        not null,
   ID_USUARIO           integer                        null,
   FECHA_PEDIDO         date                           null,
   FECHA_ENTREGA        date                           null,
   DIRECCION            varchar(100)                   null,
   constraint PK_PEDIDO primary key (ID_PEDIDO)
);

/*==============================================================*/
/* Index: PEDIDO_PK                                             */
/*==============================================================*/
create unique index PEDIDO_PK on PEDIDO (
ID_PEDIDO ASC
);

/*==============================================================*/
/* Index: REALIZAR_FK                                           */
/*==============================================================*/
create index REALIZAR_FK on PEDIDO (
ID_USUARIO ASC
);

/*==============================================================*/
/* Table: PRODUCTO                                              */
/*==============================================================*/
create table PRODUCTO 
(
   ID_PRODUCTO          integer                        not null,
   TIPO                 varchar(50)                    null,
   VARIEDAD             varchar(50)                    null,
   COLOR                varchar(50)                    null,
   DESCRIPCION          varchar(250)                   null,
   TOP_PICTURE          long binary                    null,
   SIDE_PICTURE         long binary                    null,
   LONGITUD_DISPONIBLE_CM_ varchar(25)                 null,
   TIEMPO_DE_VIDA_DIAS_ varchar(10)                    null,
   TAMANO_FLOR          float                          null,
   ESPINAS              smallint                       null,
   PETALOS_POR_FLOR     integer                        null,
   STOCK                integer                        null,
   constraint PK_PRODUCTO primary key (ID_PRODUCTO)
);

/*==============================================================*/
/* Index: PRODUCTO_PK                                           */
/*==============================================================*/
create unique index PRODUCTO_PK on PRODUCTO (
ID_PRODUCTO ASC
);

/*==============================================================*/
/* Table: SUCURSAL                                              */
/*==============================================================*/
create table SUCURSAL 
(
   ID_SUCURSAL          integer                        not null,
   NOMBRE               varchar(50)                    null,
   DIRECCION            varchar(100)                   null,
   constraint PK_SUCURSAL primary key (ID_SUCURSAL)
);

/*==============================================================*/
/* Index: SUCURSAL_PK                                           */
/*==============================================================*/
create unique index SUCURSAL_PK on SUCURSAL (
ID_SUCURSAL ASC
);

/*==============================================================*/
/* Table: USUARIO                                               */
/*==============================================================*/
create table USUARIO 
(
   ID_USUARIO           integer                        not null,
   ID_SUCURSAL          integer                        null,
   USUARIO              varchar(50)                    null,
   CONTRASENA           varchar(100)                   null,
   NOMBRES              varchar(100)                   null,
   APELLIDOS            varchar(100)                   null,
   TELEFONO             varchar(10)                    null,
   CORREO_ELECTRONICO   varchar(50)                    null,
   ROL                  varchar(50)                    null,
   constraint PK_USUARIO primary key (ID_USUARIO)
);

/*==============================================================*/
/* Index: USUARIO_PK                                            */
/*==============================================================*/
create unique index USUARIO_PK on USUARIO (
ID_USUARIO ASC
);

/*==============================================================*/
/* Index: PERTENECE_FK                                          */
/*==============================================================*/
create index PERTENECE_FK on USUARIO (
ID_SUCURSAL ASC
);

/*==============================================================*/
/* Índice opcional para columna USUARIO                        */
/*==============================================================*/
create index IDX_USUARIO on USUARIO (
USUARIO ASC
);

/*==============================================================*/
/* Restricciones de claves foráneas                             */
/*==============================================================*/
alter table INCLUYE
   add constraint FK_INCLUYE_INCLUYE_PRODUCTO foreign key (ID_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO)
      on update restrict
      on delete restrict;

alter table INCLUYE
   add constraint FK_INCLUYE_INCLUYE2_PEDIDO foreign key (ID_PEDIDO)
      references PEDIDO (ID_PEDIDO)
      on update restrict
      on delete restrict;

alter table PEDIDO
   add constraint FK_PEDIDO_REALIZAR_USUARIO foreign key (ID_USUARIO)
      references USUARIO (ID_USUARIO)
      on update restrict
      on delete restrict;

alter table USUARIO
   add constraint FK_USUARIO_PERTENECE_SUCURSAL foreign key (ID_SUCURSAL)
      references SUCURSAL (ID_SUCURSAL)
      on update restrict
      on delete restrict;

